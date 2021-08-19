// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: agoric/lien/lien.proto

package types

import (
	fmt "fmt"
	github_com_cosmos_cosmos_sdk_types "github.com/cosmos/cosmos-sdk/types"
	types "github.com/cosmos/cosmos-sdk/types"
	_ "github.com/gogo/protobuf/gogoproto"
	proto "github.com/gogo/protobuf/proto"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

// Lien contains the lien state of a particular account.
type Lien struct {
	Coins github_com_cosmos_cosmos_sdk_types.Coins `protobuf:"bytes,1,rep,name=coins,proto3,castrepeated=github.com/cosmos/cosmos-sdk/types.Coins" json:"coins"`
}

func (m *Lien) Reset()         { *m = Lien{} }
func (m *Lien) String() string { return proto.CompactTextString(m) }
func (*Lien) ProtoMessage()    {}
func (*Lien) Descriptor() ([]byte, []int) {
	return fileDescriptor_7e748ec8ed81c39b, []int{0}
}
func (m *Lien) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Lien) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Lien.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Lien) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Lien.Merge(m, src)
}
func (m *Lien) XXX_Size() int {
	return m.Size()
}
func (m *Lien) XXX_DiscardUnknown() {
	xxx_messageInfo_Lien.DiscardUnknown(m)
}

var xxx_messageInfo_Lien proto.InternalMessageInfo

func (m *Lien) GetCoins() github_com_cosmos_cosmos_sdk_types.Coins {
	if m != nil {
		return m.Coins
	}
	return nil
}

func init() {
	proto.RegisterType((*Lien)(nil), "agoric.lien.Lien")
}

func init() { proto.RegisterFile("agoric/lien/lien.proto", fileDescriptor_7e748ec8ed81c39b) }

var fileDescriptor_7e748ec8ed81c39b = []byte{
	// 228 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x12, 0x4b, 0x4c, 0xcf, 0x2f,
	0xca, 0x4c, 0xd6, 0xcf, 0xc9, 0x4c, 0xcd, 0x03, 0x13, 0x7a, 0x05, 0x45, 0xf9, 0x25, 0xf9, 0x42,
	0xdc, 0x10, 0x71, 0x3d, 0x90, 0x90, 0x94, 0x48, 0x7a, 0x7e, 0x7a, 0x3e, 0x58, 0x5c, 0x1f, 0xc4,
	0x82, 0x28, 0x91, 0x92, 0x4b, 0xce, 0x2f, 0xce, 0xcd, 0x2f, 0xd6, 0x4f, 0x4a, 0x2c, 0x4e, 0xd5,
	0x2f, 0x33, 0x4c, 0x4a, 0x2d, 0x49, 0x34, 0xd4, 0x4f, 0xce, 0xcf, 0x84, 0x1a, 0xa1, 0x94, 0xc9,
	0xc5, 0xe2, 0x93, 0x99, 0x9a, 0x27, 0x94, 0xc8, 0xc5, 0x0a, 0x12, 0x2d, 0x96, 0x60, 0x54, 0x60,
	0xd6, 0xe0, 0x36, 0x92, 0xd4, 0x83, 0xe8, 0xd3, 0x03, 0xe9, 0xd3, 0x83, 0xea, 0xd3, 0x73, 0xce,
	0xcf, 0xcc, 0x73, 0x32, 0x38, 0x71, 0x4f, 0x9e, 0x61, 0xd5, 0x7d, 0x79, 0x8d, 0xf4, 0xcc, 0x92,
	0x8c, 0xd2, 0x24, 0xbd, 0xe4, 0xfc, 0x5c, 0x7d, 0xa8, 0x25, 0x10, 0x4a, 0xb7, 0x38, 0x25, 0x5b,
	0xbf, 0xa4, 0xb2, 0x20, 0xb5, 0x18, 0xac, 0xa1, 0x38, 0x08, 0x62, 0xb2, 0x53, 0xe0, 0x89, 0x47,
	0x72, 0x8c, 0x17, 0x1e, 0xc9, 0x31, 0x3e, 0x78, 0x24, 0xc7, 0x38, 0xe1, 0xb1, 0x1c, 0xc3, 0x85,
	0xc7, 0x72, 0x0c, 0x37, 0x1e, 0xcb, 0x31, 0x44, 0x99, 0x23, 0x19, 0xe5, 0x08, 0xf1, 0x2a, 0xc4,
	0x67, 0x60, 0xa3, 0xd2, 0xf3, 0x73, 0x12, 0xf3, 0xd2, 0x61, 0x76, 0x54, 0x40, 0x42, 0x01, 0x6c,
	0x7e, 0x12, 0x1b, 0xd8, 0x13, 0xc6, 0x80, 0x00, 0x00, 0x00, 0xff, 0xff, 0x08, 0x48, 0x75, 0x8a,
	0x21, 0x01, 0x00, 0x00,
}

func (m *Lien) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Lien) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Lien) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Coins) > 0 {
		for iNdEx := len(m.Coins) - 1; iNdEx >= 0; iNdEx-- {
			{
				size, err := m.Coins[iNdEx].MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintLien(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0xa
		}
	}
	return len(dAtA) - i, nil
}

func encodeVarintLien(dAtA []byte, offset int, v uint64) int {
	offset -= sovLien(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *Lien) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if len(m.Coins) > 0 {
		for _, e := range m.Coins {
			l = e.Size()
			n += 1 + l + sovLien(uint64(l))
		}
	}
	return n
}

func sovLien(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozLien(x uint64) (n int) {
	return sovLien(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *Lien) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowLien
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Lien: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Lien: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Coins", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowLien
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthLien
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthLien
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Coins = append(m.Coins, types.Coin{})
			if err := m.Coins[len(m.Coins)-1].Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipLien(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthLien
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipLien(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowLien
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowLien
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowLien
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthLien
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupLien
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthLien
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthLien        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowLien          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupLien = fmt.Errorf("proto: unexpected end of group")
)
